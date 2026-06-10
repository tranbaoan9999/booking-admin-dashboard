import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme as setThemeAction } from '@/store/slices/uiSlice';

export function useTheme() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  const toggleTheme = () => {
    dispatch(setThemeAction(theme === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    dispatch(setThemeAction(newTheme));
  };

  return {
    theme,
    toggleTheme,
    setTheme,
  };
}
