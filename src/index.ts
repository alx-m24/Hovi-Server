const LoginHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            height: 100vh;
            align-items: center;
            justify-content: center;
            background: #f0f2f5;
        }

        .login-box {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            width: 300px;
            text-align: center;
        }

        select, input, button {
            margin-top: 10px;
            padding: 10px;
            width: 100%;
            border-radius: 6px;
            border: 1px solid #ccc;
        }

        button {
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }

            button:hover {
                background: #0056b3;
            }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>Login</h2>
        <form action="/login" method="POST">
            <label>Select User:</label>
            <select name="user" required>
                <option value="User1">Alex</option>
                <option value="User2">Hovi</option>
            </select>
            <p/>
            <label>Select Correct Date:</label>
            <input type="date" name="date" required>
            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>`;

const WelcomeHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Additional Info</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="https://tinyurl.com/3rnepj4r">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            height: 100vh;
            align-items: center;
            justify-content: center;
            background: #f0f2f5;
        }

        .login-box {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            width: 300px;
            text-align: center;
        }

        select, input, button {
            margin-top: 10px;
            padding: 10px;
            width: 100%;
            border-radius: 6px;
            border: 1px solid #ccc;
        }

        button {
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }

            button:hover {
                background: #0056b3;
            }
    </style>
</head>
<body>
    <h1>Additional Information</h1>
    <p>Welcome {{name}}</p>
</body>
</html>`;

const ADMIN_PASSWORD = "SuperSecretPassword1234";

export default {
    async fetch(request: Request, env: Env) {
        const url = new URL(request.url);

        if (url.pathname === "/") {
            return new Response(LoginHTML, {
                headers: { "Content-Type": "text/html;charset=UTF-8" },
            });
        }

        // Step 1: register
        if (url.pathname === "/login" && request.method === "POST") {
            const formData = await request.formData();
            const user_name = formData.get("user")?.toString() || "";
            const date = formData.get("date")?.toString() || "";

            if (date == "2024-12-07") {
                const filledHtml = additionalInfoHtml.replace(
                    'value=""',
                    `value="${user_name}"`
                );

                return new Response(filledHtml, {
                    headers: { "Content-Type": "text/html;charset=UTF-8" },
                });
            }

            return new Response("Unauthorized", {
                headers: { "Content-Type": "text/plain" }
            });
        }

        // Step 2: additional info
        if (url.pathname === "/additional" && request.method === "POST") {
            const formData = await request.formData();
            const email = formData.get("email")?.toString() || "";
            const diet = formData.get("diet")?.toString() || "";
            const allergies = formData.get("allergies")?.toString() || "";
            const info = formData.get("info")?.toString() || "";

            // Update the registration with additional info
            await env.DB.prepare(
                "UPDATE registrations SET diet = ?, allergies = ?, extra_info = ? WHERE email = ?"
            )
                .bind(diet, allergies, info, email)
                .run();

            return new Response(`Thank you! Your additional information has been saved.`, {
                headers: { "Content-Type": "text/plain" },
            });
        }

        return new Response("Not found", { status: 404 });
    }
} satisfies ExportedHandler<Env>;