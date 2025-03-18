async function saveUser(newUser) {
    const users = await getUsers();
    users.push(newUser);

    // En un servidor real se enviaría con una API, pero simularemos con localStorage
    localStorage.setItem("users", JSON.stringify(users));
}
