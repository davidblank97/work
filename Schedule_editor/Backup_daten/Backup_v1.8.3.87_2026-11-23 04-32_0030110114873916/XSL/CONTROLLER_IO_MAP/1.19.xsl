<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	
	<xsl:template match="iomap/digital_servo/io[@module='JASPER']/zero" />
		
	<xsl:template match="iomap/digital_servo[@index='0']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		  <acceleration_feed_forward offset="43" mask="0x9000" digital_high="4095" digital_low="0" />
		  <acceleration offset="43" mask="0xA000" digital_high="4095" digital_low="0" />
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='1']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		  <acceleration_feed_forward offset="44" mask="0x9000" digital_high="4095" digital_low="0" />
		  <acceleration offset="44" mask="0xA000" digital_high="4095" digital_low="0" />
	</xsl:template>
		
	<xsl:template match="iomap/digital_servo[@index='2']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		  <acceleration_feed_forward offset="45" mask="0x9000" digital_high="4095" digital_low="0" />
		  <acceleration offset="45" mask="0xA000" digital_high="4095" digital_low="0" />
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='3']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		  <acceleration_feed_forward offset="46" mask="0x9000" digital_high="4095" digital_low="0" />
		  <acceleration offset="46" mask="0xA000" digital_high="4095" digital_low="0" />
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='4']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		  <acceleration_feed_forward offset="47" mask="0x9000" digital_high="4095" digital_low="0" />
		  <acceleration offset="47" mask="0xA000" digital_high="4095" digital_low="0" />
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='5']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		  <acceleration_feed_forward offset="48" mask="0x9000" digital_high="4095" digital_low="0" />
		  <acceleration offset="48" mask="0xA000" digital_high="4095" digital_low="0" />
	</xsl:template>
	
	<xsl:template match="iomap/digital_servo[@index='6']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		  <acceleration_feed_forward offset="49" mask="0x9000" digital_high="4095" digital_low="0" />
		  <acceleration offset="49" mask="0xA000" digital_high="4095" digital_low="0" />
	</xsl:template>

	<xsl:template match="iomap/digital_servo[@index='7']/io[@module='JASPER']/*[last()]">
		<xsl:copy-of select="."/>
		  <acceleration_feed_forward offset="50" mask="0x9000" digital_high="4095" digital_low="0" />
		  <acceleration offset="50" mask="0xA000" digital_high="4095" digital_low="0" />
	</xsl:template>
	
	<xsl:template match="iomap/system/io[@module='JASPER']/properties/enabled_pins/*[last()]">
		<xsl:copy-of select="."/>
		  <gpio>169</gpio>
		  <gpio>189</gpio>
		  <gpio>187</gpio>
		  <gpio>98</gpio>
		  <gpio>186</gpio>
		  <gpio>99</gpio>
		  <gpio>185</gpio>
		  <gpio>100</gpio>
		  <gpio>184</gpio>
		  <gpio>101</gpio>
		  <gpio>5</gpio>
		  <gpio>102</gpio>
		  <gpio>4</gpio>
		  <gpio>103</gpio>
		  <gpio>32</gpio>
		  <gpio>36</gpio>
		  <gpio>38</gpio>
		  <gpio>76</gpio>
	</xsl:template>	
	
	<xsl:template match="iomap/power/io[@module='JASPER']/mig_pulse_exponential_decay_period">
		<mig_pulse_exponential_decay_factor offset="85" digital_high="32767" digital_low="0"/>
	</xsl:template>
		
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/has_arc_starter">
		<has_arc_starter offset="9999" bit="169" />
	</xsl:template> 
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/has_hotwire">
		<has_hotwire offset="9999" bit="189" />
	</xsl:template>
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/has_external_estop">
		<has_external_estop offset="9999" bit="98" />
	</xsl:template> 
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/hw_spare_digital_input_3">
		<hw_spare_digital_input_3 offset="9999" bit="99" />
	</xsl:template> 
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/hw_spare_digital_input_4">
		<hw_spare_digital_input_4 offset="9999" bit="100" />
	</xsl:template> 
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/hw_spare_digital_input_5">
		<hw_spare_digital_input_5 offset="9999" bit="101" />
	</xsl:template> 
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/hw_spare_digital_input_6">
		<hw_spare_digital_input_6 offset="9999" bit="102" />
	</xsl:template> 
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/hw_spare_digital_input_7">
		<hw_spare_digital_input_7 offset="9999" bit="103" />
	</xsl:template> 
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/hw_spare_digital_input_8">
		<hw_spare_digital_input_8 offset="9999" bit="32" />
	</xsl:template> 
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/hw_spare_digital_input_9">
		<hw_spare_digital_input_9 offset="9999" bit="36" />
	</xsl:template> 
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/hw_spare_digital_input_10">
		<hw_spare_digital_input_10 offset="9999" bit="38" />
	</xsl:template> 
	
	<xsl:template match="iomap/hardware_detection/io[@module='JASPER']/hw_spare_digital_input_11">
		<hw_spare_digital_input_11 offset="9999" bit="76" />
	</xsl:template> 
	
	<!-- Do not change the template below -->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>