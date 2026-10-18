interface ServerUnavailableProps {
  onRetry: () => void;
}

export function ServerUnavailable({ onRetry }: ServerUnavailableProps) {
  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <div role="alert">
        <h1>Сервер недоступен</h1>
        <p>Не удалось связаться с сервером. Проверьте подключение и попробуйте ещё раз.</p>
        <button onClick={onRetry}>Повторить</button>
      </div>
    </div>
  );
}