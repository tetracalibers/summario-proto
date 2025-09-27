
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/router";
import { TermService } from "~/services/TermService";

const termService = new TermService();

// GET
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const keyword = url.searchParams.get("keyword");

  try {
    if (id) {
      const term = await termService.getTermById(Number(id));
      if (!term) {
        return json({ error: "Term not found" }, { status: 404 });
      }
      return json(term);
    }

    if (keyword) {
      const terms = await termService.searchTerms(keyword);
      return json(terms);
    }

    return json({ error: "Invalid request: id or keyword must be provided" }, { status: 400 });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "An unexpected error occurred" }, { status: 500 });
  }
}

// POST, PUT, DELETE
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const method = formData.get("_method")?.toString().toUpperCase() || request.method;

  try {
    switch (method) {
      case "POST": {
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        // TODO: validation
        const newTerm = await termService.createTerm({ title, content });
        return json(newTerm, { status: 201 });
      }
      case "PUT": {
        const id = formData.get("id");
        if (!id) return json({ error: "ID is required for update" }, { status: 400 });

        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const updatedTerm = await termService.updateTerm(Number(id), { title, content });
        return json(updatedTerm);
      }
      case "DELETE": {
        const id = formData.get("id");
        if (!id) return json({ error: "ID is required for delete" }, { status: 400 });

        await termService.deleteTerm(Number(id));
        return json({ success: true }, { status: 200 });
      }
      default: {
        return json({ error: "Method not allowed" }, { status: 405 });
      }
    }
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "An unexpected error occurred" }, { status: 500 });
  }
}
