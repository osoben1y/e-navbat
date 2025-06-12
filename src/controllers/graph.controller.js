import Graph from '../models/graph.model.js';
import { graphValidator } from '../validation/graph.validation.js';
import { catchError } from '../utils/error-response.js';

export class GraphController {
    async createGraph(req,res){
        try {
            const {error, value} = graphValidator(req.body);
            if(error){
                return catchError(400, error.message, res);
            }
            const graph = await Graph.create(value);
            return res.status(201).json({
                statusCode: 201, 
                message: 'success',
                data: graph
            })
        } catch (error) {
            return catchError(500, error.message, res);
        }
    }

    async getAllGraph(_, res){
        try {
            const graphs = await Graph.find().populate('doctorId')
            if(!graphs.length){
                return catchError(404, 'Graphs not found', res);
            }
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: graphs
            })
        } catch (error) {
            return catchError(500, error.message, res);
        }
    }

    async getGrapfById (req, res) {
        try {
            const data = await Graph.findById(req.params.id);
            if(!data){
                return catchError(404, ' Graph not found', res);
            }
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: data
            })
        } catch (error) {
            return catchError(500, error.message, res);
        }
    }

    async updateGraph(req, res){
        try {
            const data = await Graph.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if(!data) {
        return catchError(404, 'Graph not found', res);
      }
      return res.status(200).json({
        statusCode: 200,
        message: 'success',
        data: data
      })
        } catch (error) {
            return catchError(500, error.message, res);
        }
    }
    async deleteGraph(req, res) {
        try {
            const data = await Graph.findByIdAndDelete(req.params.id);
            if(!data) {
                return catchError(404, 'Graph not found', res);
            }
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {}
            });
        } catch (error) {
            return catchError(500, error.message, res);
        }
    }
}