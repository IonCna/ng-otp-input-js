import type { IComponentOptions } from 'angular';
import template from './demo-highlight.component.html?raw';

class DemoHighlightController {
  public eyebrow = '';
  public title = '';
  public text = '';
}

export const demoHighlightComponent: IComponentOptions = {
  bindings: {
    eyebrow: '@',
    title: '@',
    text: '@',
  },
  controller: DemoHighlightController,
  template,
};
