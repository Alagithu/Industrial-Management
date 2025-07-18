import './Home.css'
 const FactoryHomePage = () => {
  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="homepage">
      {/* Section principale (Hero) */}
      <section className="hero">
        <h1 className="hero-title">Gérez Votre Usine Intelligemment</h1>
        <p className="hero-subtitle">
          Boostez la performance de vos départements et collaborateurs 
        </p>
        <p className="hero-subtitle">
           grâce à une gestion optimisée et un suivi complet des formations essentielles pour vos employés 
        </p>
       
        <button className="hero-button" onClick={navigateToLogin}>
          <i className="fas fa-rocket"></i> Créer Votre Usine
        </button>
      </section>

      {/* Lien vers Font Awesome */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        rel="stylesheet"
      />
    </div>
  );
};

export default FactoryHomePage;