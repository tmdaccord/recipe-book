import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {map} from 'rxjs/operators';
import {Recipe} from '../recipes/recipe.model';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class DataStorageService {

  constructor(private httpClient: HttpClient, private recipeService: RecipeService, private authService: AuthService) {
  }

  storeRecipes() {
    // const token = this.authService.getToken();
    return this.httpClient.put('https://ng-recipe-book-a334f.firebaseio.com/recipes.json',
      this.recipeService.getRecipes()
      // {params: new HttpParams().set('auth', token)}
      );
  }

  getRecipes() {
    // const token = this.authService.getToken();

    return this.httpClient.get<Recipe[]>('https://ng-recipe-book-a334f.firebaseio.com/recipes.json'
      // {params: new HttpParams().set('auth', token)}
      )
      .pipe(map((recipes) => {
        for (const recipe of recipes) {
          if (!recipe.ingredients) {
            console.log(recipe);
            recipe.ingredients = [];
          }
        }
        return recipes;
      }))
      .subscribe(
        (recipes: Recipe[]) => {
          this.recipeService.setRecipes(recipes);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
