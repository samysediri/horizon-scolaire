const confirmUser = async () => {
  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    setError(error.message);
    setLoading(false);
    return;
  }

  // Attendre 800ms PUIS faire l'appel à getUser()
  setTimeout(async () => {
    const { data: userData } = await supabase.auth.getUser();
    const hasPassword = userData?.user?.user_metadata?.password_created;

    if (!hasPassword && type === "invite") {
      router.push("/creer-mot-de-passe");
    } else {
      router.push("/dashboard");
    }
  }, 800);
};
