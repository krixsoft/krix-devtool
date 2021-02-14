export const stateChanges = [
  {
    statePath: 'session.navTab',
    state: ['session', 'navTab'],
    oldValue: null,
    newValue: 'overview',
    options: {
      signal: true, //optional
    },
  },
  {
    statePath: 'session.appType',
    state: ['session', 'appType'],
    oldValue: null,
    newValue: 'admin',
  },
  {
    statePath: 'global.userHasGroup',
    state: ['global', 'userHasGroup'],
    oldValue: null,
    newValue: true,
  },
  {
    statePath: 'browser.deviceZoom',
    state: ['browser', 'deviceZoom'],
    oldValue: null,
    newValue: 1,
  },
  {
    statePath: 'session.navTab',
    state: ['session', 'navTab'],
    oldValue: 'overview',
    newValue: 'chats',
  },
  {
    statePath: 'session.user',
    state: ['session', 'user'],
    oldValue: null,
    newValue: {
      id: 54, name: {
        hello: undefined,
        world: [1, 'string', 3, 4, 5],
      },
    },
  },
  {
    statePath: 'session.appType',
    state: ['session', 'appType'],
    oldValue: 'admin',
    newValue: 'demo',
    options: {
      signal: true, //optional
    },
  },
  {
    statePath: 'global.userHasGroup',
    state: ['global', 'userHasGroup'],
    oldValue: true,
    newValue: false,
  },
  {
    statePath: 'session.user',
    state: ['session', 'user'],
    oldValue: {
      id: 54, name: {
        hello: undefined,
        world: [1, 'string', 3, 4, 5],
      },
    },
    newValue: {
      id: null, name: {
        hello: null,
        world: null,
      },
    },
  },
];

export const state = {
  session: {
    appType: 'demo',
    user: 'User',
    navTab: {
      size: null,
      col: {
        hel: 5,
        lo: 'No',
      },
      tab: {
        hel: undefined,
        lo: 'No',
      },
    },
  },
  global: {
    userHasGroup: 'hello',
  },
};
