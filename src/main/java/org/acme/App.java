package org.acme;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class App {

    public static void main(String[] args) {
        Connection conn = null;
        try {
            // Connect to in-memory SQLite database
            conn = DriverManager.getConnection("jdbc:sqlite::memory:");
            System.out.println("Database connection established.");

            // Create the PERSON table
            String createSQL = "CREATE TABLE PERSON(id int PRIMARY KEY, name varchar(20))";
            PreparedStatement statement = conn.prepareStatement(createSQL);
            statement.executeUpdate();
            System.out.println("Table PERSON created.");

            // Insert data into the PERSON table
            String insertSQL = "INSERT INTO PERSON (id, name) VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie')";
            PreparedStatement statement2 = conn.prepareStatement(insertSQL);
            statement2.executeUpdate();
            System.out.println("Inserted records: Alice, Bob, Charlie.");

            // Read and display data from the PERSON table
            String selectSQL = "SELECT * FROM PERSON";
            PreparedStatement statement3 = conn.prepareStatement(selectSQL);
            ResultSet resultSet = statement3.executeQuery();
            System.out.println("Initial records:");
            while (resultSet.next()) {
                System.out.println("Person: " + resultSet.getString("name"));
            }

            // Update Alice's name to Allison
            String updateSQL = "UPDATE PERSON SET name = 'Allison' WHERE id = 1";
            PreparedStatement statement4 = conn.prepareStatement(updateSQL);
            statement4.executeUpdate();
            System.out.println("Updated record: Alice to Allison.");

            // Read and display data after update
            resultSet = statement3.executeQuery();  // Re-run the query
            System.out.println("Records after update:");
            while (resultSet.next()) {
                System.out.println("Person: " + resultSet.getString("name"));
            }

            // Delete Bob's record
            String deleteSQL = "DELETE FROM PERSON WHERE id = 2";
            PreparedStatement statement5 = conn.prepareStatement(deleteSQL);
            statement5.executeUpdate();
            System.out.println("Deleted record: Bob.");

            // Read and display data after deletion
            resultSet = statement3.executeQuery();  // Re-run the query
            System.out.println("Records after deletion:");
            while (resultSet.next()) {
                System.out.println("Person: " + resultSet.getString("name"));
            }

        } catch (Exception e) {
            System.err.println(e.getMessage());
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (Exception e) {
                System.err.println(e.getMessage());
            }
        }
    }
}
