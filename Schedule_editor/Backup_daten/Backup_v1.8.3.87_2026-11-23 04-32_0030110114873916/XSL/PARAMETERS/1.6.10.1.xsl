<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/Parameters/param[@id='200712']">
		<xsl:copy-of select="."/>
				<param id="267521">
					<name>IN DWELL AVERAGE</name>
					<short_name></short_name>
					<desc>Average amperage or voltage for the entire in-dwell period.</desc>
				</param>
				<param id="267522">
					<name>OUT DWELL AVERAGE</name>
					<short_name></short_name>
					<desc>Average amperage or voltage for the entire out-dwell period.</desc>
				</param>	
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>