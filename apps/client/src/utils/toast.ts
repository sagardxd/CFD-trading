import * as Burnt from "burnt";


export const successToast  = (title: string, message?: string) => {
    Burnt.toast({
        title: title,
        preset: "done",
        message: message,
      });
}

export const errorToast = (title: string, message?: string) => {
  Burnt.toast({
      title: title,
      preset: "error",
      message: message,
    });
}