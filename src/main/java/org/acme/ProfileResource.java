package org.acme;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import jakarta.ws.rs.core.Response.Status;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.persistence.EntityManager;

@Path("/api/profile")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProfileResource {

    @Inject
    EntityManager em;

    @PATCH
    @Path("/update-picture")
    @Transactional
    public Response updateProfilePicture(@QueryParam("userId") Long userId, String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return Response.status(Status.BAD_REQUEST)
                .entity("Image URL cannot be null or empty.")
                .build();
        }

        User user = em.find(User.class, userId);
        if (user == null) {
            return Response.status(Status.NOT_FOUND)
                .entity("User not found.")
                .build();
        }

        user.setProfilePictureUrl(imageUrl);
        em.merge(user);

        return Response.ok(user).build();
    }
}
