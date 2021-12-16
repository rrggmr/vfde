export default {
    methods: {
        getIcon: (icon) => {
            return require('@/assets/' + icon + '.svg')
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
