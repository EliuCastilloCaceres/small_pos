export const formatToMoney = (amount) => {
    const amountFormatted = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(amount);

    return amountFormatted
}