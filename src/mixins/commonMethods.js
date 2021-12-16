export default {
    methods: {
        getRandomInt(max) {
            return Math.floor(Math.random() * max);
        },
        getNthObjectElement(object, n) {
            return object[Object.keys(object)[n]];
        },
        lastElementOfPath() {
            const currentPath = this.$route.path;
            const pathElements = currentPath.split("/")
            const filtered = pathElements.filter(function(value){
                return value !== ""
            })
            return filtered[filtered.length - 1].toLowerCase()
        },
        localiseNumbers(string) {
            if(parseFloat(string) || parseInt(string)) {
                return this.$n(string)
            }
            return string
        },
        localiseDate(dateString, dateTime=false) {
            const parseDate = Date.parse(dateString)
            if (parseDate) {
                if (!dateTime) {
                    return this.$d(parseDate)
                } else {
                    return this.$d(parseDate, "dateTime")
                }
            }
            return dateString
        },
        sqlDate(dateString = false) {
            if (!dateString) {
                dateString = new Date()
            }
            return dateString.toISOString().slice(0, 19).replace('T', ' ');
        }
    }
}
