import * as Burnt from "burnt";

export const successToast = () => {
    Burnt.toast({
        title: "Burnt installed.",
        preset: "done",
        message: "See your downloads.",
      });
}