export const countdown = (open: string, close: string) => {
    const date = new Date()
    let day = date.getDate().toString()
    let month = (date.getMonth() + 1).toString()
    let year = date.getFullYear().toString()
    if (parseInt(month) < 10) month = `0${month}`
    if (parseInt(day) < 10) day = `0${day}`
    if (parseInt(close.split(":")[0]) < parseInt(open.split(":")[0])) {
        day = (parseInt(day) + 1).toString()
    }

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