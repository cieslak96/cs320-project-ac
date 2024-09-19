package org.acme;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/hello")
public class GreetingResource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello RESTEasy";
    }

    @GET
    @Path("/personalized/{name}")
    @Produces(MediaType.TEXT_PLAIN)
    public String personalizedHello(@PathParam("name") String name) {
        return "Hello " + name + "!";
    }

    @POST
    @Path("/personalized")
    @Produces(MediaType.TEXT_PLAIN)
    public String personalizedHelloPost(Person p) {
        return "Hello " + p.getFirstName() + " " + p.getLastName();
    }

    public static class Person {
        private String firstName;
        private String lastName;

        // Getter and Setter for firstName
        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        // Getter and Setter for lastName
        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }
    }
}


