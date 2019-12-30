import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import {Recipe} from '../recipes/recipe.model';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class DataStorageService {

  constructor(private httpClient: HttpClient, private recipeService: RecipeService, private authService: AuthService) {
  }

  storeRecipes() {
    // const token = this.authService.getToken();
    this.httpClient.put('https://ng-recipe-book-a334f.firebaseio.com/recipes.json',
      this.recipeService.getRecipes()
      // {params: new HttpParams().set('auth', token)}
    ).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  fetchRecipes() {
    // const token = this.authService.getToken();
    return this.httpClient.get<Recipe[]>('https://ng-recipe-book-a334f.firebaseio.com/recipes.json').pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
    // return this.httpClient.get<Recipe[]>('https://ng-recipe-book-a334f.firebaseio.com/recipes.json'
    //   // {params: new HttpParams().set('auth', token)}
    // )
    //   .pipe()
    //   .subscribe(
    //     (recipes: Recipe[]) => {
    //       this.recipeService.setRecipes(recipes);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
  }
}
