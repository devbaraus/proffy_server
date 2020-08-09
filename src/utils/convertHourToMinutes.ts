export default function convertHourToMinutes(time: String) {
    // 8:00
    const [hour, minutes] = time.split(':').map(Number)
    return (hour * 60) + minutes
}
