const $container = document.querySelector('.container')
const $date = document.querySelector('.date-box')
const $currencyBox = document.querySelector('.currency-box')
const $input = document.querySelector('input');
const $converterBox = document.querySelector('.converter-box')
const $select = document.querySelector('.select')
let $resultsHolder = document.createElement('div')
// setInputFilter(document.getElementById("input"), function(value) {
//     return /^\d*\.?\d*$/.test(value);
// });
// setInputFilter()
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
        let result = allCurrencies.filter((currency) => currency.r030 === 840 || currency.r030 === 978 || currency.r030 === 643)
    return new Promise((resolve => {
             resolve(result.map(item => {
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
    let $rub = document.createElement('div')
    $rub.innerHTML = 'RUB'
    let $usd = document.createElement('div')
    $usd.innerHTML = '<span>USD</span>'
    let $eur = document.createElement('div')
    $eur.innerHTML = '<span>EUR</span>'
    let $uah = document.createElement('div')
    $uah.innerHTML = '<span>UAH</span>'

    document.querySelector('form').addEventListener('change', function () {
        let resultNumbers = getResultNumbers($select.selectedIndex)
        let $resultCurrencies =  [$rub, $usd, $eur, $uah]
        $resultsHolder.classList.add('results-holder')
        // if($input.value)
        function getResultNumbers() {
            let result = [+$input.value];
            if ($select.selectedIndex === 0) {
                let rubToUah = resultArray[0].rate * $input.value
                let rubToUsd = rubToUah / resultArray[1].rate
                let rubToEur = rubToUah / resultArray[2].rate
                result.push(rubToUah, rubToUsd, rubToEur)
            } else if ($select.selectedIndex === 1) {
                let usdToUah = $input.value * resultArray[1].rate
                let usdToEur = usdToUah / resultArray[2].rate
                let usdToRub = usdToUah / resultArray[0].rate
                result.push(usdToUah, usdToEur, usdToRub)
            } else if ($select.selectedIndex === 2) {
                let eurToUah = $input.value * resultArray[2].rate;
                let eurToUsd = eurToUah / resultArray[1].rate
                let eurToRub = eurToUah / resultArray[0].rate
                result.push(eurToUah, eurToUsd, eurToRub)
            } else if ($select.selectedIndex === 3) {
                let uahToRub = $input.value / resultArray[0].rate
                let uahToUsd = $input.value / resultArray[1].rate
                let uahToEur = $input.value / resultArray[2].rate
                result.push(uahToRub, uahToUsd, uahToEur)
            }
            return result
        }

        function showResult() {
            let index1 = 0;
            let index2 = 0;
            function cortege(i1, i2) {
                console.log($resultCurrencies[i1])
                let n = resultNumbers[i2].toFixed(2)
                return $resultCurrencies[i1].innerHTML = String(n)
            }

    for (let i = 0; i < 4; i++) {
        $resultCurrencies[i].innerHTML = cortege(index1++, index2++)
        $resultsHolder.append( $resultCurrencies[i])
    }
        }
        $converterBox.append($resultsHolder)
        showResult()
    })

})













