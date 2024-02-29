export const countdown = (open: string, close: string, tomorrow = false) => {
    let thisDate = new Date()

    let day = thisDate.getDate().toString()
    let month = (thisDate.getMonth() + 1).toString()
    let year = thisDate.getFullYear().toString()

    if (tomorrow) {
        thisDate.setDate(thisDate.getDate() + 1)
        day = thisDate.getDate().toString()
        month = (thisDate.getMonth() + 1).toString()
        year = thisDate.getFullYear().toString()
    }

    if (parseInt(month) < 10) month = `0${month}`
    if (parseInt(day) < 10) day = `0${day}`

    
    const closeLotto = new Date(`${year}-${month}-${day}T${close}:00`)
    const now = new Date().getTime();
    const distance = closeLotto!.getTime() - now;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds }
}