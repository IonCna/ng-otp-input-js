import type { IComponentOptions } from 'angular';

class AppRootController {
  public title = 'AngularJS App';
  public description = 'Inicio minimo con componente principal en clase.';
}

export const appRootComponent: IComponentOptions = {
  controller: AppRootController,
  template: `
    <main class="app-root container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="app-root__panel card border-0 shadow-sm">
            <div class="card-body p-4 p-md-5">
              <p class="app-root__eyebrow text-primary fw-semibold mb-2">Starter</p>
              <h1 class="app-root__title display-5 mb-3">{{ $ctrl.title }}</h1>
              <p class="app-root__description lead text-secondary mb-4">{{ $ctrl.description }}</p>

              <div class="mb-4">
                <ng-otp-input></ng-otp-input>
              </div>

              <div class="d-flex gap-2 flex-wrap">
                <button type="button" class="btn btn-primary">Primary action</button>
                <button type="button" class="btn btn-outline-secondary">Secondary</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
};
