<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="iomap/power/io[@module='JASPER']/min_on_time/@digital_high">  
		<xsl:attribute name="digital_high">
			<xsl:value-of select="'4095'"/>
		</xsl:attribute>
	</xsl:template>
	<xsl:template match="iomap/power/io[@module='JASPER']/max_on_time/@digital_high">  
		<xsl:attribute name="digital_high">
			<xsl:value-of select="'4095'"/>
		</xsl:attribute>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>