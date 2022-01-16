const $container = document.querySelector('.container')
const $date = document.querySelector('.date-box')
const $currencyBox = document.querySelector('.currency-box')
const $input = document.querySelector('#uah');
const $converterBox = document.querySelector('.converter-box')
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
    $input.addEventListener('change', function () {
        let resRub = $input.value / resultArray[0].rate
        let resUsd = $input.value / resultArray[1].rate
        let resEur = $input.value / resultArray[2].rate
            function showResult() {
                $rub.innerText = 'RUB ' + resRub.toFixed(2)
                $usd.innerHTML = 'USD ' + resUsd.toFixed(2)
                $eur.innerHTML = 'EUR ' + resEur.toFixed(2)
                $resultsHolder.classList.add('results-holder')
                $resultsHolder.append($rub, $usd, $eur)
                $converterBox.append($resultsHolder)
        }
        showResult()
    })
})




