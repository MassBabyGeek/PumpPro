import React, {Component, ErrorInfo, ReactNode} from 'react';
import CrashScreen from './CrashScreen';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary - Capture les erreurs non gérées dans l'application
 * et affiche un écran de crash avec possibilité de signaler le bug
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Mise à jour de l'état pour afficher l'UI de secours au prochain rendu
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Capturer l'erreur et ses informations
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Vous pouvez aussi envoyer l'erreur à un service de monitoring ici
    // Ex: Sentry.captureException(error);
  }

  handleReset = (): void => {
    // Réinitialiser l'état pour permettre à l'utilisateur de réessayer
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <CrashScreen
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
