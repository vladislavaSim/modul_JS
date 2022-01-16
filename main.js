const $container = document.querySelector('.container')
const $date = document.querySelector('.date-box')
const $currencyBox = document.querySelector('.currency-box')
const $input = document.querySelector('#uah');
const $converterBox = document.querySelector('.converter-box')
const $select = document.querySelector('.select')

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
    let $resultsHolder = document.createElement('div')
    let $rub = document.createElement('div')
    let $usd = document.createElement('div')
    let $eur = document.createElement('div')
    let $uah = document.createElement('div')

    $select.addEventListener('change', function () {
        // console.log($select.options[$select.selectedIndex].value)
        let selectedCurrency;
        if($select.selectedIndex === 0) {
            selectedCurrency = 'usd'
        }
        console.log($select.selectedIndex)
    })

    $input.addEventListener('change', function () {
        let uahToRub = $input.value / resultArray[0].rate
        let uahToUsd = $input.value / resultArray[1].rate
        let uahToEur = $input.value / resultArray[2].rate
        let rubToUah = resultArray[0].rate * $input.value
        let rubToUsd = rubToUah / resultArray[1].rate
        let rubToEur = rubToUah  / resultArray[2].rate
        let usdToUah = $input.value * resultArray[1].rate
        let usdToEur = usdToUah / resultArray[2].rate
        let usdToRub = usdToUah / resultArray[0].rate
        let eurToUah = $input.value * resultArray[2].rate;
        let eurToUsd = eurToUah / resultArray[1].rate
        let eurToRub = eurToUah / resultArray[0].rate
        console.log(eurToUah, eurToUsd, eurToRub)
            function showResult() {

                $rub.innerText = 'RUB ' + uahToRub.toFixed(2)
                $usd.innerHTML = 'USD ' + uahToUsd.toFixed(2)
                $eur.innerHTML = 'EUR ' + uahToEur.toFixed(2)
                $resultsHolder.classList.add('results-holder')
                $resultsHolder.append($rub, $usd, $eur, $uah)
                $converterBox.append($resultsHolder)
        }
        showResult()
    })
})
const currencyNames = ['usd', 'eur', 'rub', 'uah'];

function defineOptionValues() {
    let $options = $select.querySelectorAll('option')
        for(let i = 0;  i < currencyNames.length; i++) {
            $options.value = currencyNames[i]
    }
    return $options
}
defineOptionValues()

function convert(selectedName) {
    if(selectedName === 'usd') {
        return convertFromUsd()
    } else if(selectedName === 'eur') {
        return convertFromEur()
    }  else if(selectedName === 'rub') {
        return convertFromRub()
    }  else if(selectedName === 'uah') {
        return convertFromUah()
    } else {
        return 'error occurred'
    }
}






