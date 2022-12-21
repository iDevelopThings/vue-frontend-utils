import {createApp} from "vue";
import App from "./App.vue";
import Plugin from "../VuePlugin/Plugin";
import "./app.css";
import "./ModalDefs";

const app = createApp(App);
app.use(Plugin);
app.mount("#app");

(window as any).app = app;
