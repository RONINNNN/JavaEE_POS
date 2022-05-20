package servlet;

import javax.annotation.Resource;
import javax.json.*;
import javax.naming.Name;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


@WebServlet(urlPatterns = "/customer")
public class CustomerServlet extends HttpServlet {

    @Resource(name = "java:comp/env/jdbc/pool")
    DataSource ds ;
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        JsonObjectBuilder objectBuilder = Json.createObjectBuilder();
        JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
        JsonObjectBuilder response = Json.createObjectBuilder();
        JsonObjectBuilder dataMsgBuilder = Json.createObjectBuilder();
        PrintWriter writer = resp.getWriter();
        Connection connection =null;
        try {
             connection = ds.getConnection();
            String option = req.getParameter("option");
            switch (option){
                case "GETALL":
                    ResultSet rst = connection.prepareStatement("SELECT * FROM customer").executeQuery();
                    while (rst.next()){
                        String id = rst.getString(1);
                        String name = rst.getString(2);
                        String address = rst.getString(3);
                        int salary = rst.getInt(4);

                        objectBuilder.add("id",id);
                        objectBuilder.add("name",name);
                        objectBuilder.add("address",address);
                        objectBuilder.add("salary",salary);

                        arrayBuilder.add(objectBuilder.build());
                    }

                    response.add("status",200);
                    response.add("message","Done");
                    response.add("data",arrayBuilder.build());

                    writer.print(response.build());

                    break;
                case "GenId":
                    ResultSet resultSet = connection.prepareStatement("SELECT id FROM customer ORDER BY id DESC LIMIT 1").executeQuery();
                    if (resultSet.next()) {
                        int tempId = Integer.parseInt(resultSet.getString(1).split("-")[1]);
                        tempId+=1;
                        if (tempId < 10) {
                            objectBuilder.add("id", "C00-00" + tempId);
                        } else if (tempId < 100) {
                            objectBuilder.add("id", "C00-0" + tempId);
                        } else if (tempId < 1000) {
                            objectBuilder.add("id", "C00-" + tempId);
                        }
                    }else{
                        objectBuilder.add("id", "C00-000");
                    }
                    dataMsgBuilder.add("data",objectBuilder.build());
                    dataMsgBuilder.add("message","Done");
                    dataMsgBuilder.add("status",200);
                    writer.print(dataMsgBuilder.build());

                    break;

            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        finally {
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }

    }


    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
        resp.setContentType("application/json");

        //we have to get updated data from JSON format
        JsonReader reader = Json.createReader(req.getReader());
        JsonObject jsonObject = reader.readObject();

        String cusIDUpdate = jsonObject.getString("id");
        String cusNameUpdate = jsonObject.getString("name");
        String cusAddressUpdate = jsonObject.getString("address");
        String cusSalaryUpdate = jsonObject.getString("salary");
        PrintWriter writer = resp.getWriter();
        System.out.println(cusIDUpdate + " " + cusAddressUpdate + " " + cusSalaryUpdate + " " + cusNameUpdate);

        Connection connection = null;
        try {
            connection = ds.getConnection();
            PreparedStatement pstm = connection.prepareStatement("UPDATE customer SET name=?, address=?, salary=? WHERE id=?");
            pstm.setObject(1, cusNameUpdate);
            pstm.setObject(2, cusAddressUpdate);
            pstm.setObject(3, cusSalaryUpdate);
            pstm.setObject(4, cusIDUpdate);

            if (pstm.executeUpdate() > 0) {
                JsonObjectBuilder response = Json.createObjectBuilder();
                resp.setStatus(HttpServletResponse.SC_CREATED);//201
                response.add("status", 200);
                response.add("message", "Successfully Updated");
                response.add("data", "");
                writer.print(response.build());
            }

        } catch (SQLException e) {
            JsonObjectBuilder response = Json.createObjectBuilder();
            response.add("status", 400);
            response.add("message", "Error");
            response.add("data", e.getLocalizedMessage());
            writer.print(response.build());
            resp.setStatus(HttpServletResponse.SC_OK); //200
        } finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

    }


    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String customerID = req.getParameter("customerID");
        /*System.out.println("cus : " + " " + customerID);*/
        JsonObjectBuilder dataMsgBuilder = Json.createObjectBuilder();
        PrintWriter writer = resp.getWriter();

        Connection connection = null;
        try {
            connection = ds.getConnection();
            PreparedStatement pstm = connection.prepareStatement("DELETE FROM customer WHERE id=?");
            pstm.setObject(1, customerID);

            if (pstm.executeUpdate() > 0) {
                resp.setStatus(HttpServletResponse.SC_OK); //200
                dataMsgBuilder.add("data", "");
                dataMsgBuilder.add("massage", "Customer Deleted");
                dataMsgBuilder.add("status", "200");
                writer.print(dataMsgBuilder.build());
            }
        } catch (SQLException e) {
            dataMsgBuilder.add("status", 400);
            dataMsgBuilder.add("message", "Error");
            dataMsgBuilder.add("data", e.getLocalizedMessage());
            writer.print(dataMsgBuilder.build());
            resp.setStatus(HttpServletResponse.SC_OK); //200
        } finally {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}

