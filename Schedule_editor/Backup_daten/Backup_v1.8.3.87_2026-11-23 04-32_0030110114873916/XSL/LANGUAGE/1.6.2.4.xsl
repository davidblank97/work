<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language/text[@id='531']">
		<xsl:copy-of select="."/>
		<text id="532">
			<content>TIG</content>
			<desc>A type of welding process. Acronym for 'Tungsten Inert Gas' welding. Also known as GTAW welding.</desc>
		</text>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>