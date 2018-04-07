export default class Util {

    static getUuid() {
        let fn = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return fn() + fn() + fn() + fn()
    }

}