package web.twillice.lab3;

import jakarta.annotation.ManagedBean;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import lombok.Getter;
import lombok.Setter;
import web.twillice.lab3.model.Dot;
import web.twillice.lab3.repository.DotRepository;
import web.twillice.lab3.util.MessageManager;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Named
@ManagedBean
@ApplicationScoped
public class DotManager implements Serializable {
    @Inject
    private DotRepository repository;
    @Getter
    private final Dot dot = new Dot();
    @Getter
    private final List<Dot> dots = new ArrayList<>();
    // @Getter
    // private final List<Double> availableR = List.of(1.0, 1.5, 2.0, 2.5, 3.0);
    //private final List<Double> availableR = List.of(1.0, 1.25,  1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.50, 3.75, 4.00);
    //  @Getter @Setter
    //   private List<Double> selectedR = new ArrayList<>();

    @PostConstruct
    public void init() {
        dot.setY(-2.0);
    }

    public void shoot() {
        saveShot(dot);
    }

    public void shootPlot() {
        Map<String, String> requestParameters = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
        String error = requestParameters.get("error");
        if (error != null) {
            MessageManager.error(error);
            return;
        }
        Dot dot = new Dot();
        try {
            dot.setX(Double.parseDouble(requestParameters.get("x")));
            dot.setY(Double.parseDouble(requestParameters.get("y")));
            dot.setR(Double.parseDouble(requestParameters.get("r")));
        } catch (NumberFormatException | NullPointerException e) {
            MessageManager.error("Invalid values.");
            return;
        }
        saveShot(dot);
    }

    public void shootPlotIncludeScale() {
        double baseSCaleUnit = 20;
        Map<String, String> requestParameters = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
        String error = requestParameters.get("error");
        if (error != null) {
            MessageManager.error(error);
            return;
        }
        Dot dot = new Dot();
        try {
            dot.setX(Double.parseDouble(requestParameters.get("x")) * baseSCaleUnit);
            dot.setY(Double.parseDouble(requestParameters.get("y")) * baseSCaleUnit);
            dot.setR(Double.parseDouble(requestParameters.get("r")) * baseSCaleUnit);
        } catch (NumberFormatException | NullPointerException e) {
            MessageManager.error("Invalid values.");
            return;
        }
        saveShot(dot);
    }

    private void saveShot(Dot dot) {
        Dot newDot = repository.create(dot);
        dots.add(newDot);
    }
}
