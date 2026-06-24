import React from 'react';
import ShowcaseSite from './components/ShowcaseSite';

function App() {
  const handleOpenEditor = () => {
    alert('このサイトは公開用の独立したWebサイトです。ローカルの編集機能は利用できません。');
  };

  const handleOpenRigLab = () => {
    alert('このサイトは公開用の独立したWebサイトです。Rig Labは利用できません。');
  };

  return (
    <ShowcaseSite
      onOpenEditor={handleOpenEditor}
      onOpenRigLab={handleOpenRigLab}
    />
  );
}

export default App;
