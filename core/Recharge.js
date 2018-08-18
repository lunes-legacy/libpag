const soap = require('strong-soap').soap;
class Recharge {
    getOperatorsDDD(dddValue) {
        return new Promise((resolve, reject) => {
            const wsdlUri = 'http://hmlgtodaconta.is2b.com.br:54003/TodaConta/WebService?wsdl';

            const options = {
                wsdl_headers: {
                    'SOAPAction': 'http://GatewayWebService/IGatewayWeb/ProcessaTransacao',
                    'Content-Type': 'text/xml'
                },
                envelopeKey: 's'
            };

            const args = {
                transacao: {
                // Set attributes to node
                    $attributes: {
                        $xsiType: {
                            type: 'TransacaoConsultaOperadoraDDD',
                            xmlns: 'http://schemas.datacontract.org/2004/07/TodaConta.WebService.Transacoes'
                        },
                    },
                    CpfCnpj: '39233281922',
                    PontoAtendimento: {
                        Login: 'teste',
                        Senha: 'teste'
                    },
                    TipoTransacao: 'CONSULTAOPERADORADDD',
                    CategoriaRecarga: 'TODOS',
                    TipoRecarga: 'ONLINE',
                    ddd: dddValue
                }
            }

            soap.createClient(wsdlUri, options, function(err, client) {
                const method = client['GatewayWeb']['BasicHttpBinding_IGatewayWeb']['ProcessaTransacao'];

                method(args, function(err, result, envelope, soapHeader) {
                    if (err) reject(err);

                    const { CodigoErro, MensagemErro, Operadoras } = result.ProcessaTransacaoResult;

                    if (CodigoErro !== '000') {
                        reject({
                            error: true,
                            code: CodigoErro,
                            message: MensagemErro
                        });
                    }
                    console.log(Operadoras);
                    resolve(Operadoras);
                    // const operadoras = Operadoras.Operadora.map(item => {
                    //   return {
                    //     id: parseInt(item.OperadoraId),
                    //     name: item.Nome,
                    //     max: parseFloat(item.ValorMax),
                    //     min: parseFloat(item.ValorMin)
                    //   }
                    // });

                    // resolve(operadoras);
                });
            });
        });
    }
}

module.exports = Recharge;