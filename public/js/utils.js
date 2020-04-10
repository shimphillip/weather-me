const trimEmail = (email) => {
  const at = email.indexOf('@');
  const noDomainName = email.slice(0, at);

  return noDomainName;
};
