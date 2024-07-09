import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";

@Injectable()
export class AppSettingsService {
  // #region Properties (1)

  public settings: any;

  // #endregion Properties (1)

  // #region Constructors (1)

  constructor(private http: HttpClient) {
    console.log("AppSettingsService initialized");
  }

  // #endregion Constructors (1)

  // #region Public Methods (1)

  public initialize(): Promise<any> {
    return this.http
      .get<any>("assets/app-settings.json")
      .pipe(
        tap((response: any) => {
          const activeCollectionName = response.activeCollectionName
            .toLowerCase()
            .replace(/\s/g, "");
          const activeCollection = response.collections.find(
            (collection: any) =>
              collection.name.toLowerCase().replace(/\s/g, "") ===
              activeCollectionName
          );

          this.settings = activeCollection;
        })
      )
      .toPromise();
  }

  // #endregion Public Methods (1)
}
