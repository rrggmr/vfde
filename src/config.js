const cmOptions = {lineNumbers: false,
    theme: 'material-palenight',
    tabSize: 4,
    indentWithTabs: false,
    readOnly: true,
    mode: 'javascript',
    autoRefresh: true,
    scrollbarStyle: 'simple'}


const conf = {
    python: {
      tab: '    ',
      lineBreak: ' \\\n',
      newLine: '\n\n'
    },
    sparkFields: [
        'ByteType',
        'ShortType',
        'IntegerType',
        'LongType',
        'FloatType',
        'DoubleType',
        'DecimalType',
        'StringType',
        'BinaryType',
        'BooleanType',
        'TimestampType',
        'DateType',
        // 'ArrayType',
        // 'MapType',
        // 'StructType',
        // 'StructField'
    ],
    datasourceTypes: [
      {
          name: 'csv',
          options: [
              'path',
              'header',
              'enforceSchema',
              'escape',
              'sep',
              'quote',
              'encoding',
              'nullValue',
              'compression'
          ]
      },
      {
          name: 'json',
          options: [
              'path'
          ]
      }
    ],
    cmOptions: cmOptions,
    pythonEditorOptions: {
        ...cmOptions,
        lineNumbers: true,
        readOnly: false,
        mode: 'python',
    },
    debounce: {
        default: 500
    },
}

export function getEnv(name) {
    return window?.configs?.[name] || process.env[name]
}

export default conf

// Dummy data only - actual data will have real UUIDs, these ones are fake and not suitable.

const faker = require('faker')
faker.locale = "de";

function fakeDatasource() {
    return {
        name: faker.company.companyName(),
        editorConfig: {
            id: {
                value: faker.datatype.uuid(),
                freeText: true
            },
            type: "csv",
            streaming: true,
            fields: [
                {
                    fieldType: "StringType",
                    name: "Foo",
                    nullable: false
                },
                {
                    fieldType: "DecimalType",
                    name: "Bar",
                    nullable: true
                }
            ],
            options: [
                {
                    key: "path",
                    value: "https://s3.amazonaws.com/example-bucket/path/to/object",
                    freeText: false
                },
                {
                    key: "compression",
                    value: "gzip",
                    freeText: false
                },
                {
                    key: "foo",
                    value: "bar",
                    freeText: true
                }
            ],
            advanced: false
        },
        pythonCode: "schema = StructType([\n    StructField(\"Foo\", StringType(), false),\n    StructField(\"Bar\", DecimalType(), false),\n])\n\ndf = spark.readStream \\\n    .format(\"csv\") \\\n    .option(\"path\", \"https://s3.amazonaws.com/example-bucket/path/to/object\") \\\n    .option(\"compression\", \"gzip\") \\\n    .schema(schema) \\\n    .load()\n\ndf.createOrReplaceTempView(\"example-datasource\")",
        created: faker.date.recent(),
        modified: faker.date.recent(),
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function fakeText(number) {
    let myText = ""
    for (let i = 0; i<number; i++) {
        myText += faker.company.bs()
        if (i == number-1) {
            myText += "."
        } else {
            myText += " "
        }
    }
    return capitalizeFirstLetter(myText )
}

function fakeLog() {
    const randomInt = getRandomInt(8)
    const possible_actions = [
        "comment",
        "resolution",
        "update",
        "resolution",
        "update",
        "resolution",
        "update",
        "update"
    ]
    let x = 3
    const fakeAction = possible_actions[randomInt]
    if (fakeAction === "comment") {
        x = 12
    }

    return {
        id: faker.datatype.uuid(),
        action: fakeAction,
        text: fakeText(x),
        dateTime: faker.date.past()
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function fakeLogs(amount=1) {
    const logs = []
    for (let i=0; i<amount; i++) {
        logs.push(fakeLog())
    }
    return logs.sort((b, a) => new Date(a.dateTime) - new Date(b.dateTime))
}

export const fakeData = {
    logs: fakeLogs(2),
    dataSources: [
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
        fakeDatasource(),
    ],
    fields: [
        {
            key: 'Alarmtyp',
            sortable: true
        },
        {
            key: 'Alarminformationen',
            sortable: false
        }
    ],
    groupedFields: [
        {
            key: 'Anzahl',
            sortable: true
        },
        {
            key: 'Alarmtyp',
            sortable: true
        },
        {
            key: 'Alarminformationen',
            sortable: false
        }
    ],
    items: [
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            date: [
                '2020/03/01',
                '2020/03/28'
            ],
            icon: 'euro',
            expected: '1.25',
            actual: '2.84'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            date: [
                '2020/04/01',
                '2020/04/28'
            ],
            icon: 'package',
            expected: 'P3A11',
            actual: 'P3A12'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            date: [
                '2020/05/01',
                '2020/05/28'
            ],
            icon: 'receipt',
            text: 'Comet 319-246'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            date: [
                '2020/06/01',
                '2020/06/28'
            ],
            icon: 'euro',
            expected: '1.25',
            actual: '2.84'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            date: [
                '2020/07/01',
                '2020/07/28'
            ],
            icon: 'package',
            expected: 'P3A12',
            actual: 'P3A14'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            date: [
                '2020/08/01',
                '2020/08/28'
            ],
            icon: 'receipt',
            text: 'Comet 319-246'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            date: [
                '2020/09/01',
                '2020/09/28'
            ],
            icon: 'euro',
            expected: '1.25',
            actual: '2.84'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            date: [
                '2020/10/01',
                '2020/10/28'
            ],
            icon: 'package',
            expected: 'P3A12',
            actual: 'P3A14'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            date: [
                '2020/11/01',
                '2020/11/28'
            ],
            icon: 'receipt',
            text: 'Comet 319-246'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            date: [
                '2020/12/01',
                '2020/12/28'
            ],
            icon: 'euro',
            expected: '1.00',
            actual: '2.80'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            date: [
                '2021/01/01',
                '2021/01/28'
            ],
            icon: 'package',
            expected: 'P3A11',
            actual: 'P3A18'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            date: [
                '2021/02/01',
                '2021/02/28'
            ],
            icon: 'receipt',
            text: 'Comet 319-246'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            date: [
                '2021/03/01',
                '2021/03/28'
            ],
            icon: 'euro',
            expected: '1.25',
            actual: '2.84'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            date: [
                '2021/04/01',
                '2021/04/28'
            ],
            icon: 'package',
            expected: 'P3A11',
            actual: 'P3A12'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            date: [
                '2021/05/01',
                '2021/05/28'
            ],
            icon: 'receipt',
            text: 'Comet 319-246'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            date: [
                '2021/06/01',
                '2021/06/28'
            ],
            icon: 'euro',
            expected: '1.25',
            actual: '2.84'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            date: [
                '2021/07/01',
                '2021/07/28'
            ],
            icon: 'package',
            expected: 'P3A12',
            actual: 'P3A14'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            date: [
                '2021/08/01',
                '2021/08/28'
            ],
            icon: 'receipt',
            text: 'Comet 319-246'
        }
    ],
    groupedItems: [
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            count: 20000,
            icon: 'euro',
            expected: '1000.25',
            actual: '2040.84'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            count: 576,
            icon: 'package',
            expected: 'P3A11',
            actual: 'P3A12'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            count: 54,
            icon: 'receipt',
            text: 'Comet 319-246'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            count: 34,
            icon: 'euro',
            expected: '1.23',
            actual: '2.65'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            count: 54,
            icon: 'package',
            expected: 'P3A13',
            actual: 'P3A15'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            count: 1154,
            icon: 'receipt',
            text: 'Comet 3319-24226'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            count: 2254,
            icon: 'euro',
            expected: '1.29',
            actual: '5'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            count: 354,
            icon: 'package',
            expected: 'P3A16',
            actual: 'P3A14'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            count: 754,
            icon: 'receipt',
            text: 'Comet 366-236'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            count: 854,
            icon: 'euro',
            expected: '1.00',
            actual: '2.80'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            count: 154,
            icon: 'package',
            expected: 'P3A11',
            actual: 'P3A18'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            count: 254,
            icon: 'receipt',
            text: 'Comet 3319-222246'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            count: 5478,
            icon: 'euro',
            expected: '1.22',
            actual: '9.84'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            count: 5554,
            icon: 'package',
            expected: 'P3A10',
            actual: 'P3A22'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            count: 5408,
            icon: 'receipt',
            text: 'Comet 39-2646'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Rechnung',
            count: 254,
            icon: 'euro',
            expected: '7.25',
            actual: '56.84'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'falsche Ware',
            count: 354,
            icon: 'package',
            expected: 'P3A02',
            actual: 'P3A19'
        },
        {
            uuid: faker.datatype.uuid(),
            type: 'unbekannte Produktlinie',
            count: 545,
            icon: 'receipt',
            text: 'Comet 329-046'
        }
    ]
}

