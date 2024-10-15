package org.acme;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.annotations.jaxrs.PathParam;

import java.util.List;

@Path("/hello")
public class GreetingResource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello RESTEasy";
    }

    @POST
@Path("/personalized")
@Produces(MediaType.TEXT_PLAIN)
@Consumes(MediaType.APPLICATION_JSON)
public String personalizedHelloPost(Person p) {
    if (p.getFirstName() == null || p.getFirstName().isBlank() ||
        p.getLastName() == null || p.getLastName().isBlank()) {
        throw new WebApplicationException("First and Last names cannot be blank", Response.Status.BAD_REQUEST);
    }
    return "Hello " + p.getFirstName() + " " + p.getLastName();
}
    @POST
    @Path("/personalized/{name}")
    @Produces(MediaType.TEXT_PLAIN)
    @Transactional
    public Response personalizedHelloSave(@PathParam String name) {
        if (name == null || name.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Name cannot be blank").build();
        }

        // Check if the name already exists (optional feature)
        if (UserName.find("name", name).firstResult() != null) {
            return Response.status(Response.Status.CONFLICT).entity("Name already exists").build();
        }

        // Create and persist a new UserName entity
        UserName userName = new UserName(name);
        userName.persist();

        // Return a success message
        return Response.ok("Hello " + name + "! Your name has been stored in the database.").build();
    }

    // Read operation: Get all usernames
    @GET
    @Path("/users")
    @Produces(MediaType.APPLICATION_JSON)
    public List<UserName> getAllUsers() {
        return UserName.listAll();
    }

    // Read operation: Get a username by ID
    @GET
    @Path("/users/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserById(@PathParam Long id) {
        UserName user = UserName.findById(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        }
        return Response.ok(user).build();
    }

    // Update operation: Update an existing username
    @PATCH
    @Path("/users/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    @Transactional
    public Response updateUser(@PathParam Long id, @QueryParam("name") String newName) {
        if (newName == null || newName.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("New name cannot be blank").build();
        }

        UserName user = UserName.findById(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        }

        user.name = newName;
        user.persist();

        return Response.ok("User ID " + id + " updated to " + newName).build();
    }

    // Delete operation: Delete a username by ID
    @DELETE
    @Path("/users/{id}")
    @Produces(MediaType.TEXT_PLAIN)
    @Transactional
    public Response deleteUser(@PathParam Long id) {
        UserName user = UserName.findById(id);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        }

        String name = user.name; // Store the name before deleting the user
        user.delete();
        return Response.ok("User ID " + id + " (" + name + ") deleted !").build();
    }
}