---
meta:
  title: Router
  description: A description of the component goes here.
layout: component
---

```html preview
 <iframe src='assets/examples/routerIframe.html' style='width:100%;height:300px;'></iframe>
```

   
### Routing Context
```javascript
/**
 * Declare the contextual data of the current route
 */
export type RouterContextData = {
  path: string /***hash path*/;
  queryString?: string /**Query String */;
  queryData: { [key in string]: string | number | string[] | number[] } /**Query Parameters */;
  pathData: { [key in string]: string | number } /** path parameter */;
};
```

### Routing Configuration 

```javascript
export type RouterItem = {
  name?: string /**Path Name */;
  path: string /***Matching paths */;
  import?: string | (() => any | Promise<any>) /**Resources that need to be loaded dynamically */;
  children?: RouterItem[] /**Subpaths**/;
  component: string | ((data: RouterContextData, item: RouterItem, importResult: any) => HTMLElement | Promise<HTMLElement>); //Matching paths, how to create components
  afterCreate?: (el: HTMLElement, data: RouterContextData, item: RouterItem) => void | Promise<void>; //Callback after component connection
  [key: string]: string | number | unknown /***Other custom properties */;
};
```
### Route creation
```javascript
     //<sl-router id="sl-routerDIV"></sl-router>
    const router = document.querySelector('#sl-routerDIV');
    //If there are more than one Router on the same page, please specify the name of Router.name , and the name of SlRouterLink
 ```  
 ### Routing navigation encryption and guarding
 ```javascript
     import { CryptoHashResovle } from 'dist/components/router/cryptoHashResovle.js';
    router.pathResovle = CryptoHashResovle; //Encrypted navigation paths

     //to,from :{item:RouterItem, data:RouterContextData}
     router.beforeRouter = (to, from, next) => {
      console.log('before', 'to', to, 'from', from);
      next(); //The route will not trigger without executing next
    };
     router.afterRouter = (to, from) => {
      console.log('after', 'to', to, 'from', from);
    };
 ``` 
 
 ### Navigate to a specific route
 ```javascript
router.toHashPath(urlpattern,jsonData);
//Or navigate via sl-router-link.
//<sl-router-link src="/a1">/al</sl-router-link>
//When encrypting, if the default router.name='default', if there are multiple routers, please execute sl-router-link.name;

/** Set navigation urlpattern */
//   @property()
//   src: string;
//   /**Is external navigation */
//   @property({ attribute: false })
//   external: boolean = false;

//   /**Match SlRouter route, equal to default if not specified */
//   @property({ attribute: false })
//   routerName: string;

//   /** Navigate the parameters or path data to be submitted */
//   @property({ type: Object, attribute: false })
//   data: PathNameResult;
````


