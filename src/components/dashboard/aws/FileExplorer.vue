<template>
  <div>
    <div v-if="!environmentError">
      <ul class="action_icons" v-if="folderExists">
        <li style="right:8rem"><font-awesome-icon class="filter" icon="filter" /><input v-model="filter" /></li>
        <li id="button_refresh" style="right:8rem; font-size: .8em; top:0.125em">
          <a href="#" @click.prevent="refresh"><font-awesome-icon icon="redo-alt" /></a>
        </li>
        <li id="button_create_folder" style="right:6rem">
          <a href="#" @click.prevent="showNewFolderModal"><font-awesome-icon icon="folder-plus" /></a>
        </li>
        <li id="button_upload_file" style="right:4rem; font-size: .9em">
          <a href="#" @click.prevent="showUploadModal"><font-awesome-icon icon="file-upload" /></a>
        </li>
        <li id="button_delete" style="right:2rem; font-size: .8em;">
          <a href="#" @click.prevent="showDeleteModal"><font-awesome-icon alt="Delete selected files" icon="trash" /></a>
        </li>
      </ul>
      <b-tabs>
        <b-tab :title="$t('AWS-Datei-Explorer')" >
          <b-card>
            <ul class="breadcrumb" >
              <li
                  @click="openFolder(breadcrumb.key)"
                  :class="breadcrumbClass"
                  :key="`breadcrumb_${breadcrumb.name}`"
                  v-for="breadcrumb in breadcrumbs">
                <span v-if="isHome(breadcrumb.name)">{{$t("Hauptseite")}}</span>
                <span v-else-if="folderExists">{{breadcrumb.name}}</span>
              </li>
            </ul>
            <Loading v-if="loading" />
            <div v-else>
              <b-table
                  v-if="folderExists"
                  show-empty
                  id="fileExplorerTable"
                  :items="tableData"
                  :fields="explorerConfig.fields"
                  :filter="filter"
                  empty-text="There are no items in this folder."
                  :per-page="perPage"
                  :current-page="currentPage"
              >
                <template v-slot:cell(selected)="data">
                  <b-form-checkbox v-model="data.item.selected"/>
                </template>
                <template v-slot:cell(type)="data">
                  <font-awesome-icon class="file-type" :icon="data.value" />
                </template>
                <template v-slot:cell(Name)="data">
                  <a href="#" @click.prevent="openObject(data.item, $event)">
                    {{ data.item.Name.replace('/', '') }}
                  </a>
                </template>
              </b-table>
              <p v-else>404. This folder does not exist.</p>
              <b-pagination
                  v-if="rows > perPage"
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                  aria-controls="fileExplorerTable"
              ></b-pagination>
            </div>
          </b-card>
        </b-tab>
      </b-tabs>
      <b-modal ref="upload-modal" hide-footer title="Upload a file to S3" size="lg">
        <b-form id="uploadForm" @submit.prevent="uploadFiles" v-if="!uploading">
          <b-form-file
              v-model="filesToUpload"
              :state="Boolean(filesToUpload)"
              placeholder="Browse to files or drag and drop here."
              drop-placeholder="Drag and drop files here."
              name="files_to_upload"
              multiple
          ></b-form-file>
          <b-button class="upload-button" type="submit" variant="primary" :disabled="!filesToUpload.length">Submit</b-button>
        </b-form>
        <div style="padding:1em" id="progress-bar" :key="progressBarKey" v-else>
          <b-table :items="uploaded" :fields="uploadedFields" striped outlined thead-class="d-none" >
            <template v-slot:cell(progress)="data">
              <div class="s3-progress-bar">
                <div class="numbers">{{data.item.loaded}} / {{data.item.total}}</div>
                <div class="fill" :style="`width:${data.item.progress}%`"></div>
              </div>
            </template>
            <template v-slot:cell(status)="data">
              <font-awesome-icon v-if="data.item.status==='waiting'" class="status-icon waiting" icon="ellipsis-h" />
              <font-awesome-icon v-if="data.item.status==='uploading'" class="status-icon uploading" icon="arrow-alt-circle-up" />
              <font-awesome-icon v-if="data.item.status==='complete'" class="status-icon complete" icon="check-circle" />
            </template>
          </b-table>
        </div>
      </b-modal>
      <b-modal ref="create-folder-modal" hide-footer title="Create a folder">
        <b-form @submit.prevent="newFolder">
          <b-form-input v-model="newFolderName" name="newFolder" />
          <b-button :disabled="!newFolderName" class="upload-button" type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-modal>
      <b-modal ref="delete-modal" hide-footer title="Confirm you want to delete the following items">
        <p>If you delete folders, you will also delete any subfolders and items they contain.</p>
        <b-form @submit.prevent="deleteFiles">
          <ul v-if="filesToDelete.length">
            <li :key="`file_to_delete_${index}`" v-for="(file, index) in filesToDelete">{{file.Name}}</li>
          </ul>
          <p v-else>No files are selected.</p>
          <b-button :disabled="!filesToDelete.length" class="upload-button" type="submit" variant="danger">Delete</b-button>
        </b-form>
      </b-modal>
    </div>
    <div v-else>
      <p>
        AWS File Explorer isn't available right now. It should be back online soon!
      </p>
    </div>
  </div>
</template>

<script>

import moment from "moment-timezone"
import Loading from "@/components/Loading";

export default {
  name: "FileExplorer",
  components: {Loading},
  mounted() {
    if (!this.environmentError) {
      this.aws.config.update(
          {
            region: this.explorerConfig.region,
            accessKeyId: this.explorerConfig.accessKey,
            secretAccessKey: this.explorerConfig.secretKey,
            correctClockSkew: true,
            signatureVersion: 'v4'
          }
      );
      this.s3 = new this.aws.S3({apiVersion: this.explorerConfig.api});
      this.updateExplorerFromRoute()
    } else {
      console.log("Environment error: Are your environment variables set up correctly?")
    }

  },
  data() {
    try {
      return {
        aws: require('aws-sdk'),
        currentPage:1,
        perPage:25,
        uploaded: [],
        filesUploaded: 0,
        loading: true,
        progressBarKey: this.randomKey(),
        uploadedFields: [
          'name',
          'progress',
          'status'
        ],
        folderExists: false,
        uploading: false,
        explorerConfig: {
          accessKey: process.env.VUE_APP_S3_ACCESS_KEY,
          secretKey: process.env.VUE_APP_S3_SECRET_KEY,
          prefix: process.env.VUE_APP_S3_DEFAULT_FOLDER,
          home: process.env.VUE_APP_S3_DEFAULT_FOLDER.replace('/', ''),
          bucket: process.env.VUE_APP_S3_BUCKET,
          region: process.env.VUE_APP_S3_REGION,
          api: process.env.VUE_APP_S3_API_VERSION,
          fields: [
            'selected',
            {
              key: 'type',
              sortable: true,
              sortByFormatted: true,
              formatter: (value) => {
                const fileType = value.toLowerCase()
                let icon
                switch (fileType) {
                    // Folder
                  case 'folder':
                    icon = 'folder-open'
                    break;
                    //  Audio formats
                  case 'm4a':
                  case 'flac':
                  case 'mp3':
                  case 'wav':
                  case 'wma':
                  case 'aac':
                    icon = 'file-audio'
                    break
                    //  Video formats
                  case 'mp4':
                  case 'mov':
                  case 'wmv':
                  case 'avi':
                  case 'avchd':
                  case 'flv':
                  case 'f4v':
                  case 'swf':
                  case 'webm':
                  case 'mpeg-2':
                    icon = 'file-video'
                    break
                    // Archive formats
                  case 'zip':
                  case 'rar':
                  case 'gz':
                  case '7z':
                    icon = 'file-archive'
                    break
                    // Image formats
                  case 'gif':
                  case 'jpg':
                  case 'jpeg':
                  case 'svg':
                  case 'bmp':
                  case 'png':
                  case 'psd':
                  case 'ai':
                    icon = 'file-image'
                    break
                    // Excel
                  case 'xls':
                  case 'xlsx':
                    icon = 'file-excel'
                    break
                    // Word
                  case 'doc':
                  case 'docx':
                    icon = 'file-word'
                    break
                    // Powerpoint
                  case 'ppt':
                  case 'pptx':
                    icon = 'file-powerpoint'
                    break
                    // CSV
                  case 'csv':
                    icon = 'file-csv'
                    break
                    // PDF
                  case 'pdf':
                    icon = 'file-pdf'
                    break
                    // Text file
                  case 'txt':
                    icon = 'file-alt'
                    break
                    // If no match default to a blank file icon
                  default:
                    icon = 'file'
                }
                return icon
              }
            },
            {
              key: 'Name',
              sortable: true,
              tdClass: 'text-left'
            },
            {
              key: 'LastModified',
              sortable: true,
              formatter: (value) => {
                return moment(value).tz(this.timeZone).format("DD/MM/YYYY HH:mm:ss")
              }
            },
            {
              key: 'Size',
              sortable: true,
              formatter: (value) => {
                return this.humanFileSize(value)
              },
            },
          ]
        },
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        s3Objects: [],
        s3: null,
        tableData: [],
        breadcrumbs: [],
        newFolderName: "",
        filesToDelete: [],
        filesToUpload: [],
        foldersToDelete: [],
        filter: "",
        downloaded: 0,
        breadcrumbKey: this.randomKey(),
        environmentError: false
      }
    }
    catch {
      return {
        environmentError: true
      }
    }
  },
  computed: {
    rows() {
      return this.tableData.length
    },
    breadcrumbClass() {
      if (this.folderExists) {
        return "breadcrumb-item"
      }
      return ""
    }
  },
  watch: {
    $route() {
      this.updateExplorerFromRoute()
    }
  },
  methods: {
    refresh() {
      this.getObjects(this.explorerConfig.prefix)
    },
    updateExplorerFromRoute() {
      let folderPath = this.$route.path.replace('/aws','')
      let fullPath = this.explorerConfig.home  + folderPath
      if (fullPath.substr(-1) != "/") {
        fullPath+="/"
      }
      this.explorerConfig.prefix = fullPath
      this.getObjects(this.explorerConfig.prefix)
    },
    isHome(breadcrumb) {
      return breadcrumb === this.explorerConfig.home
    },
    randomKey(min = 1, max = 1000) { // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    showDeleteModal() {
      this.filesToDelete = []
      for (let i=0; i<this.tableData.length; i++) {
        const currentItem = this.tableData[i]
        if (currentItem.selected) {
          this.filesToDelete.push(currentItem)
        }
      }
      this.$refs['delete-modal'].show()
    },
    showUploadModal() {
      this.filesToUpload = []
      this.$refs['upload-modal'].show()
    },
    showNewFolderModal() {
      this.filesToUpload = []
      this.$refs['create-folder-modal'].show()
    },
    openObject(item, event) {
      if(this.isFolder(item)) {
        this.openFolder(item.Key)
      } else {
        const placeholder = event.target
        const downloadInformation = document.createElement('div')
        downloadInformation.innerHTML = "Preparing download of " + event.target.text + "<span>(0/0)</span>"
        event.target.replaceWith(downloadInformation)
        this.openFile(item, placeholder, downloadInformation)
      }
    },
    openFolder(folder) {
      const newRoute = folder.replace(this.explorerConfig.home, '/aws')
      this.$router.push(newRoute);
    },
    openFile(item, placeholder, downloadInformation) {
      const tracker = downloadInformation.getElementsByTagName('span')[0]
      const component = this
      tracker.innerHTML = `(0/${component.humanFileSize(item.Size)})`
      this.s3.getObject(
          { Bucket: component.explorerConfig.bucket, Key: item.Key },
          function (error, data) {
            if (error != null) {
              console.log(error)
            } else {
              const blob = new Blob([data.Body], {type: `${data.ContentType}`})
              const fileURL = window.URL.createObjectURL(blob);
              const fileLink = document.createElement('a');
              fileLink.text = "Download again"
              fileLink.href = fileURL;
              fileLink.setAttribute('download', item.Name);
              document.body.appendChild(fileLink);
              downloadInformation.replaceWith(placeholder)
              downloadInformation.appendChild(fileLink)
              fileLink.click();
            }
          }
      ).on('httpDownloadProgress', function(progress){
        console.log(progress)
        tracker.innerHTML = `(${component.humanFileSize(progress.loaded)}/${component.humanFileSize(progress.total)})`
      });
    },
    deleteFiles() {
      const component = this
      let deleteFilesPromise = new Promise(function(resolveDelete, rejectDelete) {
        let deletedFiles
        let numberOfFiles = component.filesToDelete.length
        component.foldersToDelete = []
        for(deletedFiles=0; deletedFiles<numberOfFiles; deletedFiles++) {
          component.deleteFile(component.filesToDelete[deletedFiles])
        }
        if (deletedFiles === numberOfFiles) {
          resolveDelete(numberOfFiles + " files deleted");
        } else {
          rejectDelete("Error");
        }
      });
      deleteFilesPromise.then( (message)=> {
            console.log(message)
            if (this.foldersToDelete.length) {
              for (let folderToDelete = 0; folderToDelete < this.foldersToDelete.length; folderToDelete++) {
                this.deleteFolder(this.foldersToDelete[folderToDelete])
              }
            }
            this.getObjects(this.explorerConfig.prefix)
        }
      )
    },
    deleteFolder(folder) {
      const component = this
      let params = {
        Bucket: this.explorerConfig.bucket,
        Prefix: folder
      }
      component.s3.listObjects(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          const folderFiles = data.Contents
          component.filesToDelete = []
          for (let i=0; i < folderFiles.length; i++) {
            let folderFile = {}
            folderFile.Key = folderFile.Name = folderFiles[i].Key
            component.filesToDelete.push(folderFile)
          }
          component.deleteFiles()
        }
      })
    },
    deleteFile(file) {
      if (this.isFolder(file)) {
        this.foldersToDelete.push(file.Key)
      }
      const component = this
      let params = {
        Bucket: this.explorerConfig.bucket,
        Key: file.Key
      };
      this.s3.deleteObject(params, function(err, data) {
        if (err) {
          console.log("FAILED", err, err.stack); // an error occurred
        }
        else {
          component.$refs['delete-modal'].hide()
          if (data) {
            component.getObjects(component.explorerConfig.prefix)
          }
        }
      });
    },
    s3ToTableData() {
      this.tableData = []
      if (this.s3Objects.length) {
        this.folderExists = true
      } else {
        this.folderExists = false
      }
      for (let i=0; i < this.s3Objects.length; i++) {
        const s3Item = this.s3Objects[i]
        let item = {}
        let push = false
        item.Name = s3Item.Key.replace( new RegExp(`^${this.explorerConfig.prefix}`), "");
        if (item.Name !== "") {
          // Don't include blank names (that's the folder we're in now)
          const slashes = item.Name.split("/").length - 1;
          if (slashes === 0) {
            // This is a file in this folder, push it to the items.
            push = true
          }
          if (slashes === 1) {
            // Might be a folder, or could be a file in a different folder
            if (this.isFolder(item)) {
              // Folder, push it to items.
              push = true
            }
          }
          if (push) {
            item.LastModified = s3Item.LastModified
            item.Size = s3Item.Size
            item.Key = s3Item.Key
            item.selected = false
            item.type = this.getFileType(item.Name)
            this.tableData.push(item)
          }
        }
      }
      this.loading = false
    },
    getFileType(fileName) {
      const fileParts = fileName.split('.')
      if (fileParts.length === 1) {
        return "folder"
      } else {
        return fileParts[fileParts.length - 1]
      }
    },
    humanFileSize(bytes, si=true, dp=2) {
      if (bytes === 0) {
        return '-'
      }
      const thresh = si ? 1000 : 1024;

      if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
      }

      const units = si
          ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
          : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
      let u = -1;
      const r = 10**dp;

      do {
        bytes /= thresh;
        ++u;
      } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


      return bytes.toFixed(dp) + ' ' + units[u];
    },
    newerThan (date, hours) {
      const hour= 1000 * 60 * 60;
      return date > Date.now() - (hour * hours)
    },
    isFolder(item) {
      return item.Name.slice(-1) === '/'
    },
    newFolder() {
      this.$refs['create-folder-modal'].hide()
      this.newFolderName = this.newFolderName.replace(/\W+/g, '-').replace(/-$/, '').toLowerCase();
      this.createFolder(this.newFolderName)
      this.newFolderName = ""
    },
    getObjects(prefix) {
      const component = this
      this.explorerConfig.prefix = prefix
      // Create the parameters for calling listObjects
      let bucketParams = {
        Bucket : this.explorerConfig.bucket,
        Prefix: prefix
      };

      // Call S3 to obtain a list of the objects in the bucket
      this.s3.listObjects(bucketParams, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          component.s3Objects = data.Contents
          component.s3ToTableData()
          component.getBreadcrumbs()
        }
      });
    },
    getBreadcrumbs() {
      let breadcrumbs = []
      let key = ""
      const pieces = this.explorerConfig.prefix.split("/")
      for (let i=0; i < pieces.length-1; i++) {
        key += pieces[i] + "/"
        const crumb = {
          name: pieces[i],
          key: key
        }
        breadcrumbs.push(crumb)
      }
      this.breadcrumbs = breadcrumbs
    },
    async uploadFiles() {
      this.uploading = true
      this.uploaded = [];
      this.filesUploaded = 0;
      const component = this
      for (let i=0; i<this.filesToUpload.length; i++) {
        const file = this.filesToUpload[i]
        component.uploaded[i] = {
          name: file.name,
          progress: 0,
          loaded: 0,
          total: component.humanFileSize(file.size),
          status: "waiting"
        }
        const uploadParams = {
          Bucket: this.explorerConfig.bucket,
          Key: (this.explorerConfig.prefix || '') + (file.fullPath ? file.fullPath : file.name),
          Body: file,
          ContentType: file.type
        };
        const options = {partSize: 5 * 1024 * 1024, queueSize: 10};
        this.s3.upload (uploadParams, options, function (err, data) {
          if (err) {
            console.log("Error", err);
            component.$refs['upload-modal'].hide()
            alert('We couldn\'t upload this file.')
          } if (data) {
            // File fully uploaded
            component.progressBarKey = component.randomKey()
            component.filesUploaded++;
            if (component.filesUploaded === component.filesToUpload.length) {
              // ALL FILES UPLOADED
              component.$refs['upload-modal'].hide()
              component.getObjects(component.explorerConfig.prefix)
              component.uploading = false
            }
          }
        }).on('httpUploadProgress', function(progress){
          // progress also lists key etc and size
          const percentUploaded = progress.loaded / progress.total * 100
          if (percentUploaded > component.uploaded[i].progress) {
            // Don't refresh the page on every tick, it'll crash the browser.
            component.uploaded[i].progress = percentUploaded
            component.uploaded[i].loaded = component.humanFileSize(progress.loaded)
            component.uploaded[i].total = component.humanFileSize(progress.total)
            component.progressBarKey = component.randomKey()
          }
          if (progress.total > progress.loaded) {
            component.uploaded[i].status = 'uploading'
          } else {
            component.uploaded[i].status = 'complete'
          }
          console.log(progress)
        });

      }
    },
    createFolder(folder) {
      const key = this.explorerConfig.prefix + folder + '/'
      const component = this
      const uploadParams = {
        Bucket: this.explorerConfig.bucket,
        Key: key,
        Body: '',
        ACL: "private"
      };
      this.s3.upload (uploadParams, function (err, data) {
        if (err) {
          console.log("Error", err);
        } if (data) {
          component.getObjects(component.explorerConfig.prefix)
        }
      });
    }
  },
}
</script>

<style lang="scss">

.action_icons {
  list-style: none;
  display: inline-block;
  position: absolute;
  right:2em;
  li {
    display: inline-block;
    position: absolute;
    .filter {
      position: absolute;
      top:.25em;
      color: rgb(200, 200, 200);
      margin-left: -1.5em;
    }
    input {
      margin-right:1em;
      margin-top:-1em;
      width:15em;
      padding: 0 .5em;
    }
    a {
      color: rgba(90,90,90,1);
      &:hover {
        color: #990000
      }
      svg {
        position: absolute;
        height:1.5em !important;
        width:1.5em !important;
        margin-right: .5em;
      }
    }
  }
}

.upload-button {
  margin-top:1em;
  font-size: .9em !important;
}
.modal-header h5 {
  font-size: 1em;
}

.modal-dialog {
  font-size: .9em;
  placeholder {
    font-size: .9em !important;
  }
}

#fileExplorerTable {
  th {
    &:nth-of-type(1), &:nth-of-type(2) {
      width: 2em;
    }
    &:nth-of-type(4), &:nth-of-type(5) {
      width: 12em;
    }
  }
}

.modal-header h5 {
  font-size: 1em;
}

.status-icon {
  height:1em; width:1em;
  &.complete {
    color: rgba(40,120,40, .8);
  }
  &.uploading, &.waiting {
    color: rgba(40,40,40, .4);
  }

}

.folder-icon {
  margin-right:1em
}

.s3-progress-bar {
  width: 15em;
  height:1.5em;
  z-index: 4;
  border: 1px solid rgba(40,120,40, .5);
  border-radius: .125em;
  .fill {
    background: rgb(140,220,140);
    height:1.375em;
    z-index: 3;
    border-radius: .125em;
    transition: width .1s ease-in-out;
  }
  .numbers {
    position: absolute;
    width:15em;
    text-align: center;
  }
}
.text-left {
  padding-left:1em !important;
}
.file-type {
  font-size: 24px;
  color: #5a5a5a;
}

.breadcrumb {
  border-radius: .25em !important;
  margin-bottom: 2em !important;
}

.breadcrumb-item {
  cursor: pointer;
  color: #cc0000;
  text-decoration: underline;

  &:hover {
    color: #2b2b2b;
  }

  &:last-child {
    cursor: default;
    color: inherit;
    text-decoration: none;
  }
}

.inactive {
  font-weight: bold;

  &:after {
    content: ":";
    display: inline-block;
    width: 1em;
  }
}

.disabled {
  &.btn-primary, &.btn-danger {
    color: rgba(255,255,255,.5) !important;
  }
}


</style>
