const cmOptions = {
    lineNumbers: false,
    theme: 'material-palenight',
    tabSize: 4,
    indentWithTabs: false,
    readOnly: true,
    mode: 'javascript',
    autoRefresh: true,
    scrollbarStyle: 'simple'
}


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
faker.locale = "en";

function fakeDatasources(amount=1) {
    const datasources = []
    for (let i=0; i<amount; i ++) {
        const datasource = {
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
        datasources.push(datasource)
    }
    return datasources
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

function fakeProducts(amount) {
    const products = {}
    for (let i=0; i<amount; i ++) {
        const product = {
            "name": faker.commerce.productName(),
            "price": faker.commerce.price(),
            "material": faker.commerce.productMaterial(),
            "description": faker.commerce.productDescription(),
            "random number": faker.datatype.float(),
            "another random number": faker.datatype.float(),
            "random word": faker.lorem.word(),
            "random sentence": faker.lorem.sentence()
        }
        products[faker.datatype.uuid()] = product
    }
    return products
}

function fakeAlerts(amount) {
    const alerts = {}
    for (let i=0; i<amount; i ++) {
        const alert = fakeAlert()
        alerts[alert.uuid] = alert
    }
    return alerts
}

export function fakeAlert() {
    const randomInt = getRandomInt(3)
    let alertData
    const fakeCount = faker.datatype.number({min:500, max:20000})
    const fakeDate = [
        faker.date.between('2021-11-01', '2021-11-30'),
        faker.date.between('2021-12-01', '2021-12-31'),
    ]
    switch (randomInt) {
        case 0:
              alertData = {
                uuid: faker.datatype.uuid(),
                type: 'falsche Rechnung',
                date: fakeDate,
                count: fakeCount,
                icon: 'euro-sign',
                expected: faker.datatype.float({
                    'min': 1,
                    'max': 5
                }),
                actual: faker.datatype.float(
                    {
                        'min': 1,
                        'max': 5
                    }
                ),
            }
            return alertData

        case 1:
            alertData = {
                uuid: faker.datatype.uuid(),
                type: 'falsche Ware',
                date: fakeDate,
                count: fakeCount,
                icon: 'box-open',
                expected: `P${faker.datatype.number()}`,
                actual: `P${faker.datatype.number()}`
            }
            return alertData

        case 2:
            alertData = {
                uuid: faker.datatype.uuid(),
                type: 'unbekannte Produktlinie',
                date: fakeDate,
                count: fakeCount,
                icon: 'receipt',
                text: `${faker.commerce.productName()} ${faker.datatype.number()}`
            }
            return alertData
    }
}

export const fakeData = {
    logs: fakeLogs(2),
    dataSources: fakeDatasources(15),
    products: fakeProducts(15),
    alerts: fakeAlerts(15)
}
