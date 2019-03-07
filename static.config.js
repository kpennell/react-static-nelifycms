import axios from 'axios'

import React from 'react';
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import { createGenerateClassName } from 'material-ui/styles';
import { SheetsRegistry, JssProvider } from 'react-jss';

import { string } from './src/constants';

import { theme } from './src/theme';

export default {
  getSiteData: () => ({
    title: 'React Static',
  }),
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    )
    return [
      {
        path: '/blog',
        getData: () => ({
          posts,
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          component: 'src/containers/Post',
          getData: () => ({
            post,
          }),
        })),
      },
    ]
  },
}


export default {

  siteRoot: 'http://didactic-bikes.surge.sh/',

  getSiteData: () => ({
    title: 'Kyle',
  }),

  getRoutes: () => [
    {
      path: '/home',
      component: 'src/views/LandingPage/LandingPage.jsx',
    }
  
  ],

  /**
   * Render and capture the MUI CSS.
   * https://material-ui.com/guides/server-rendering
   */
  renderToHtml: (render, Component, renderMeta) => {
    const sheetsRegistry = new SheetsRegistry();
    const generateClassName = createGenerateClassName();
    const muiTheme = createMuiTheme(theme);

    const html = render(
      <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={muiTheme} sheetsManager={new Map()}>
          <Component />
        </MuiThemeProvider>
      </JssProvider>,
    );

    // eslint-disable-next-line no-param-reassign
    renderMeta.jssStyles = sheetsRegistry.toString();

    return html;
  },

  /* eslint-disable react/prop-types */
  Document: ({ Html, Head, Body, children, siteData, renderMeta }) => (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />

        <title>{siteData.title}</title>

        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

        <link
      rel="stylesheet"
      type="text/css"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons"
    />
    <link
      href="https://use.fontawesome.com/releases/v5.0.10/css/all.css"
      rel="stylesheet"
    />


      
      </Head>

      <Body>
        <noscript>
          You need to enable JavaScript to run this app.
        </noscript>

        {children}

        <style id={string.JSS_SERVER_SIDE_ID}>{renderMeta.jssStyles}</style>
      </Body>
    </Html>
  ),


};


