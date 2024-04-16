import { atom } from "recoil";

const messagesAtom = atom({
    key: "messageatom",
    default: []
})

export default messagesAtom