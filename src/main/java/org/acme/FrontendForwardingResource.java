package org.acme;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.nio.file.Files;  // Correct import for file operations
import java.io.IOException;

@Path("/{path:.*}") // Catch-all path
public class FrontendForwardingResource {

    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response serveFrontend() {
        try {
            // Fully qualify java.nio.file.Path here to avoid the conflict with jakarta.ws.rs.Path
            java.nio.file.Path filePath = java.nio.file.Paths.get("src/main/resources/META-INF/resources/index.html");
            
            // Read the file content as a String
            String content = Files.readString(filePath);
            
            // Return the content as the response body
            return Response.ok(content).build();
        } catch (IOException e) {
            // Handle the case where the file is not found or can't be read
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("File not found: " + e.getMessage())
                           .build();
        }
    }
}
