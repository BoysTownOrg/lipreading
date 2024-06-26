export interface Video {
  play(): void;
  show(): void;
  hide(): void;
  setOnFinish(f: () => void): void;
}

export interface Images {
  show(): void;
  hide(): void;
  setOnTouch(f: (url: string) => void): void;
}

export interface CompletionHandler {
  call(imageUrl: string): void;
}

export function runTrial(video: Video, images: Images, completionHandler: CompletionHandler) {
  images.setOnTouch((imageId) => {
    images.hide();
    completionHandler.call(imageId);
  });
  video.setOnFinish(() => {
    video.hide();
    images.show();
  });
  video.show();
  video.play();
}
