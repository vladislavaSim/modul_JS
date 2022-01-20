const $container = document.querySelector('.container')
const $date = document.querySelector('.date-box')
const $currencyBox = document.querySelector('.currency-box')
const $input = document.querySelector('input');
const $converterBox = document.querySelector('.converter-box')
const $select = document.querySelector('.select')
let $resultsHolder = document.createElement('div')

function defineOptionValues() {
    const currencyNames = ['usd', 'eur', 'rub', 'uah'];
    let $options = $select.querySelectorAll('option')
    for(let i = 0;  i < currencyNames.length; i++) {
        $options.value = currencyNames[i]
    }
    return $options
}
defineOptionValues()

    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
        .then(response => response.json())
        .then(currencies => {
            for(let currency of currencies)
            $date.innerHTML = 'на ' + currency.exchangedate
        })

async function showCurrency() {
    let response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
        let allCurrencies = await response.json()
        let result = allCurrencies.filter((currency) => currency.r030 === 978 || currency.r030 === 643 ||  currency.r030 === 840)
    let [rub, usd, eur] = result;
    let newArr = [usd, eur, rub]
    return new Promise((resolve => {
             resolve(newArr.map(item => {
                        const $currencyWrapper = document.createElement('div')
                        $currencyWrapper.classList.add('currency-wrapper')
                        const $currencyName = document.createElement('p')
                        const $rate = document.createElement('p');
                        $currencyName.innerHTML = item.txt;
                        $rate.innerHTML = item.rate + ' грн';
                        $currencyWrapper.append($currencyName, $rate)
                        $currencyBox.append($currencyWrapper);
                        return item
                    }))
        return result
    }))

}
showCurrency().then(resultArray => {
    let $value1 = document.createElement('div')
    let $value2 = document.createElement('div')
    let $value3 = document.createElement('div')

    document.querySelector('form').addEventListener('change', function () {
        let resultNumbers = getResultNumbers($select.selectedIndex)
        let $resultCurrencies =  [$value1, $value2, $value3]
        $resultsHolder.classList.add('results-holder')

        function getResultNumbers() {
            let result = [+$input.value];
            if ($select.selectedIndex === 0) {
                let usdToUah = $input.value * resultArray[0].rate
                let usdToEur = usdToUah / resultArray[1].rate
                let usdToRub = usdToUah / resultArray[2].rate
                result = [[usdToEur, 'eur'], [usdToUah, 'uah'], [usdToRub, 'rub']]
                console.log(usdToEur)
            } else if ($select.selectedIndex === 1) {
                let eurToUah = $input.value * resultArray[1].rate;
                let eurToUsd = eurToUah / resultArray[0].rate
                let eurToRub = eurToUah / resultArray[2].rate
                result = [[eurToUsd, 'usd'], [eurToUah, 'uah'], [eurToRub, 'rub']]
            } else if ($select.selectedIndex === 2) {
                let rubToUah = resultArray[2].rate * $input.value
                let rubToUsd = rubToUah / resultArray[1].rate
                let rubToEur = rubToUah / resultArray[0].rate
                result = [[rubToUsd, 'usd'], [rubToEur, 'eur'], [rubToUah, 'uah']]
            } else if ($select.selectedIndex === 3) {
                console.log(resultArray)
                let uahToRub = $input.value / resultArray[2].rate
                let uahToUsd = $input.value / resultArray[0].rate
                let uahToEur = $input.value / resultArray[1].rate
                result = [[uahToUsd, 'usd'], [uahToEur, 'eur'], [uahToRub, 'rub']]

            }
            return result
        }


        function showResult() {
            let index1 = 0;
            let index2 = 0;
            function cortege(i1, i2) {
                let n = resultNumbers[i2][0].toFixed(2)
                return $resultCurrencies[i1].innerHTML = String(n) + '  ' +resultNumbers[i2][1].toUpperCase()
            }
            console.log($resultCurrencies[0])
        for (let i = 0; i < 3; i++) {
            $resultCurrencies[i].classList.add('convert-result-' + i);
            $resultCurrencies[i].innerHTML = cortege(index1++, index2++)
            $resultsHolder.append( $resultCurrencies[i])
        }
    }
        $converterBox.append($resultsHolder)
        showResult()
    })

})













