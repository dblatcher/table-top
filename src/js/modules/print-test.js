import {postData} from './util'

function testPrint() {

    postData('/print',{
        message:'I am sending a print test'
    })
    .then(response => {
        console.log(response)
    })
    .catch(error => {
        console.warn(error)
    })


}

function initTestPrint() {
    const printButton = document.querySelector('[data-role="print-button"]')
    if (!printButton) {return false}

    printButton.addEventListener('click', testPrint)
}

export {initTestPrint}