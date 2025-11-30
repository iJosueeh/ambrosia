package com.ambrosia.ambrosia.infrastructure.config;

import com.ambrosia.ambrosia.domain.model.Opcion;
import com.ambrosia.ambrosia.domain.model.Pregunta;
import com.ambrosia.ambrosia.domain.model.TestEvaluacion;
import com.ambrosia.ambrosia.domain.repository.TestEvaluacionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TestDataSeeder implements CommandLineRunner {

    private final TestEvaluacionRepositoryPort testRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("--- TestDataSeeder: Verificando tests existentes... ---");
        List<TestEvaluacion> existingTests = testRepository.findAll();

        if (existingTests.stream().noneMatch(t -> t.getTitulo().equals("Evaluación de Bienestar Integral"))) {
            System.out.println("--- Creando Test Bienestar ---");
            createTestBienestar();
        }
        if (existingTests.stream().noneMatch(t -> t.getTitulo().equals("Test de Ansiedad (GAD-7)"))) {
            System.out.println("--- Creando Test Ansiedad ---");
            createTestAnsiedad();
        }
        if (existingTests.stream().noneMatch(t -> t.getTitulo().equals("Evaluación de Hábitos Alimenticios"))) {
            System.out.println("--- Creando Test Nutrición ---");
            createTestNutricion();
        }
        System.out.println("--- TestDataSeeder: Finalizado ---");
    }

    private void createTestBienestar() {
        TestEvaluacion test = TestEvaluacion.builder()
                .titulo("Evaluación de Bienestar Integral")
                .descripcion("Este test evalúa aspectos psicológicos y nutricionales para un bienestar completo.")
                .fechaCreacion(LocalDateTime.now())
                .preguntas(new ArrayList<>())
                .build();

        addPregunta(test, "¿Con qué frecuencia sientes estrés o ansiedad en tu día a día?", List.of(
                createOpcion("Nunca o casi nunca", 0),
                createOpcion("Raramente", 1),
                createOpcion("A veces", 2),
                createOpcion("Frecuentemente", 3),
                createOpcion("Constantemente", 4)));

        addPregunta(test, "¿Cómo describirías la calidad de tu sueño?", List.of(
                createOpcion("Muy buena, duermo profundamente", 0),
                createOpcion("Buena, me siento descansado/a", 1),
                createOpcion("Regular, a veces me cuesta dormir", 2),
                createOpcion("Mala, me despierto varias veces", 3),
                createOpcion("Muy mala, casi no duermo", 4)));

        addPregunta(test, "¿Con qué frecuencia consumes frutas y verduras?", List.of(
                createOpcion("Varias veces al día", 0),
                createOpcion("Una vez al día", 1),
                createOpcion("Algunos días a la semana", 2),
                createOpcion("Raramente", 3),
                createOpcion("Nunca o casi nunca", 4)));

        addPregunta(test, "¿Cuántos vasos de agua bebes al día en promedio?", List.of(
                createOpcion("8 o más", 0),
                createOpcion("Entre 5 y 7", 1),
                createOpcion("Entre 2 y 4", 2),
                createOpcion("Menos de 2", 3),
                createOpcion("Casi ninguno", 4)));

        testRepository.save(test);
    }

    private void createTestAnsiedad() {
        TestEvaluacion test = TestEvaluacion.builder()
                .titulo("Test de Ansiedad (GAD-7)")
                .descripcion("Cuestionario breve para detectar síntomas de ansiedad generalizada.")
                .fechaCreacion(LocalDateTime.now())
                .preguntas(new ArrayList<>())
                .build();

        addPregunta(test, "¿Te has sentido nervioso/a, ansioso/a o con los nervios de punta?", List.of(
                createOpcion("Nunca", 0),
                createOpcion("Varios días", 1),
                createOpcion("Más de la mitad de los días", 2),
                createOpcion("Casi todos los días", 3)));

        addPregunta(test, "¿No has podido dejar de preocuparte o controlar la preocupación?", List.of(
                createOpcion("Nunca", 0),
                createOpcion("Varios días", 1),
                createOpcion("Más de la mitad de los días", 2),
                createOpcion("Casi todos los días", 3)));

        addPregunta(test, "¿Te has preocupado demasiado por diferentes cosas?", List.of(
                createOpcion("Nunca", 0),
                createOpcion("Varios días", 1),
                createOpcion("Más de la mitad de los días", 2),
                createOpcion("Casi todos los días", 3)));

        addPregunta(test, "¿Has tenido dificultad para relajarte?", List.of(
                createOpcion("Nunca", 0),
                createOpcion("Varios días", 1),
                createOpcion("Más de la mitad de los días", 2),
                createOpcion("Casi todos los días", 3)));

        testRepository.save(test);
    }

    private void createTestNutricion() {
        TestEvaluacion test = TestEvaluacion.builder()
                .titulo("Evaluación de Hábitos Alimenticios")
                .descripcion("Analiza tus patrones de alimentación y recibe recomendaciones personalizadas.")
                .fechaCreacion(LocalDateTime.now())
                .preguntas(new ArrayList<>())
                .build();

        addPregunta(test, "¿Cuántas comidas realizas al día?", List.of(
                createOpcion("1-2 comidas", 1),
                createOpcion("3 comidas", 3),
                createOpcion("3 comidas + snacks saludables", 5),
                createOpcion("Como constantemente picoteando", 2)));

        addPregunta(test, "¿Incluyes proteínas en tu desayuno?", List.of(
                createOpcion("Siempre", 5),
                createOpcion("A veces", 3),
                createOpcion("Nunca, solo café o carbohidratos", 1)));

        addPregunta(test, "¿Consumes alimentos procesados o comida rápida?", List.of(
                createOpcion("Diariamente", 1),
                createOpcion("2-3 veces por semana", 2),
                createOpcion("Ocasionalmente (1 vez por semana)", 4),
                createOpcion("Casi nunca", 5)));

        testRepository.save(test);
    }

    private void addPregunta(TestEvaluacion test, String texto, List<Opcion> opciones) {
        Pregunta pregunta = Pregunta.builder()
                .texto(texto)
                .test(test)
                .opciones(new ArrayList<>())
                .build();

        for (Opcion op : opciones) {
            op.setPregunta(pregunta);
            pregunta.getOpciones().add(op);
        }

        test.getPreguntas().add(pregunta);
    }

    private Opcion createOpcion(String texto, Integer valor) {
        return Opcion.builder()
                .texto(texto)
                .valor(valor)
                .build();
    }
}
