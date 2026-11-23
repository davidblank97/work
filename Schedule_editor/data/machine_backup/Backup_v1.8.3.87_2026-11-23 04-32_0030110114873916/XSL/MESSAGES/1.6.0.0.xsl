<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='CON']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="11">
				<text>A connection request was made using the system's internal protocol with the protocol version %1 which is not supported. The only supported protocol version is %2. Please contact Liburdi for additional support.</text>
				<desc>%1 = Requested Protocol Version. %1 = Acceptable Protocol Version.</desc>
			</str>
			<str id="12">
				<text>A connection request was made using the system's internal protocol with the API version %1 which is not supported. The only supported API version is %2. Please contact Liburdi for additional support.</text>
				<desc>%1 = Requested API Version. %1 = Acceptable API Version.</desc>
			</str>
		</xsl:copy>
  	</xsl:template> 

	<xsl:template match="/language[@fileType='FLO']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="5">
				<text>Communication error on port %1. An error has occurred while processing received data. %2</text>
				<desc>Failed to process data received on the port. %1 = description of port. %2 = Further details about the error.</desc>
			</str>
		</xsl:copy>
  	</xsl:template> 

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>