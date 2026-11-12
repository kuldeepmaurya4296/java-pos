import globleState from './globleState';

export type RootState = ReturnType<typeof globleState.getState>;
export type AppDispatch = typeof globleState.dispatch;

export { globleState as store };
export default globleState;

