import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme as setThemeAction } from '@/store/slices/uiSlice';

export function useTheme() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  const toggleTheme = () => {
    if (theme === 'light') {
      dispatch(setThemeAction('dark'));
    } else if (theme === 'dark') {
      dispatch(setThemeAction('system'));
    } else {
      dispatch(setThemeAction('light'));
    }
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    dispatch(setThemeAction(newTheme));
  };

  return {
    theme,
    toggleTheme,
    setTheme,
  };
}
